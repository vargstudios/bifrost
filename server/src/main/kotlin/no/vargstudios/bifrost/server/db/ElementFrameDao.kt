package no.vargstudios.bifrost.server.db

import no.vargstudios.bifrost.server.db.model.ElementFrameRow
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

interface ElementFrameDao {

    @SqlUpdate(
        """
        insert into element_frames (id, element_id, number, transcoded)
        values (:frame.id, :frame.elementId, :frame.number, :frame.transcoded)
        """
    )
    fun insert(frame: ElementFrameRow)

    @SqlQuery("select * from element_frames where id = :id")
    fun get(id: String): ElementFrameRow?

    @SqlQuery("select * from element_frames where element_id = :elementId")
    fun listForElement(elementId: String): List<ElementFrameRow>

}
