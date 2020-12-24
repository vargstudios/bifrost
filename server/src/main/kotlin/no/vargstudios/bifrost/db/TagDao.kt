package no.vargstudios.bifrost.db

import no.vargstudios.bifrost.db.model.TagRow
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

interface TagDao {

    @SqlUpdate("""
        insert into tags (id, name)
        values (:tag.id, :tag.name)
        """)
    fun insert(tag: TagRow)

    @SqlQuery("select * from tags")
    fun list(): List<TagRow>

}
